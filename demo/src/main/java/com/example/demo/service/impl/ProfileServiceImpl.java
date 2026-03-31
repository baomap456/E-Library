package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.profile.LibraryCardResponse;
import com.example.demo.dto.profile.MembershipPackageResponse;
import com.example.demo.dto.profile.MembershipTransactionResponse;
import com.example.demo.dto.profile.ProfileMeResponse;
import com.example.demo.dto.profile.ProfileMessageResponse;
import com.example.demo.dto.profile.UpdateProfileRequest;
import com.example.demo.dto.profile.UpgradeMembershipRequest;
import com.example.demo.dto.profile.UpgradeMembershipResponse;
import com.example.demo.mapper.ProfileMapper;
import com.example.demo.model.MembershipTransaction;
import com.example.demo.model.MembershipType;
import com.example.demo.model.Notification;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.MembershipTransactionRepository;
import com.example.demo.repository.MembershipTypeRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ProfileService;
import com.example.demo.service.UserContextService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private static final int MEMBERSHIP_VALID_YEARS = 1;
    private static final int REMINDER_DAYS = 30;

    private final UserContextService userContextService;
    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;
    private final MembershipTypeRepository membershipTypeRepository;
    private final MembershipTransactionRepository membershipTransactionRepository;
    private final NotificationRepository notificationRepository;
    private final ProfileMapper profileMapper;

    @Scheduled(cron = "0 0 1 * * *")
    public void processMembershipLifecycleDaily() {
        userRepository.findAll().forEach(this::applyMembershipLifecycle);
    }

    @Override
    public ProfileMeResponse me(String username) {
        User user = userContextService.resolveUser(username);
        applyMembershipLifecycle(user);

        long borrowingCount = borrowRecordRepository.findByUserIdOrderByBorrowDateDesc(user.getId()).stream()
                .filter(record -> record.getReturnDate() == null)
                .count();

        return profileMapper.toProfileMeResponse(user, borrowingCount);
    }

    @Override
    public ProfileMessageResponse update(String username, UpdateProfileRequest request) {
        User user = userContextService.resolveUser(username);
        if (request.fullName() != null) {
            user.setFullName(request.fullName());
        }
        if (request.email() != null) {
            user.setEmail(request.email());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }
        if (request.studentId() != null) {
            user.setStudentId(request.studentId());
        }
        userRepository.save(user);
        return new ProfileMessageResponse("Cập nhật hồ sơ thành công");
    }

    @Override
    public LibraryCardResponse libraryCard(String username) {
        User user = userContextService.resolveUser(username);
        applyMembershipLifecycle(user);
        return profileMapper.toLibraryCardResponse(user);
    }

    @Override
    public List<MembershipPackageResponse> membershipPackages() {
        return membershipTypeRepository.findAll().stream()
                .sorted(Comparator
                        .comparing(com.example.demo.model.MembershipType::isPaid)
                        .thenComparing(com.example.demo.model.MembershipType::getMaxBooks))
                .map(profileMapper::toMembershipPackageResponse)
                .toList();
    }

    @Override
    public UpgradeMembershipResponse upgradeMembership(String username, UpgradeMembershipRequest request) {
        User user = userContextService.resolveUser(username);
        
        // Prevent librarians from upgrading membership
        if (isLibrarian(user)) {
            throw new IllegalArgumentException("Thủ thư không có gói thành viên");
        }
        
        applyMembershipLifecycle(user);
        String targetName = request.targetPackage().trim();

        MembershipType targetMembership = membershipTypeRepository.findByName(targetName)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói thành viên: " + targetName));

        if (!targetMembership.isPaid()) {
            throw new IllegalArgumentException("Chỉ hỗ trợ nâng cấp lên gói trả phí");
        }

        String currentName = user.getMembershipType() != null ? user.getMembershipType().getName() : "Free";
        if (currentName.equalsIgnoreCase(targetMembership.getName())) {
            return new UpgradeMembershipResponse("Bạn đang dùng gói này. Hãy chọn gia hạn nếu muốn thêm 1 năm.", currentName,
                    targetMembership.getName(), true);
        }

        user.setMembershipType(targetMembership);
        user.setMembershipActivatedAt(LocalDateTime.now());
        user.setMembershipExpiresAt(LocalDateTime.now().plusYears(MEMBERSHIP_VALID_YEARS));
        user.setMembershipReminderSentAt(null);
        userRepository.save(user);

        recordTransaction(user, resolveActorUsername(), "UPGRADE", currentName, targetMembership.getName(),
                estimatePackagePrice(targetMembership), "Nang cap goi thanh vien");

        createNotification(user,
                "Bạn đã nâng cấp lên gói " + targetMembership.getName() + ". Hiệu lực đến: " + user.getMembershipExpiresAt().toLocalDate());

        return new UpgradeMembershipResponse(
                "Nâng cấp gói thành công",
                currentName,
                targetMembership.getName(),
                targetMembership.isPaid());
    }

    @Override
    public UpgradeMembershipResponse renewMembership(String username) {
        User user = userContextService.resolveUser(username);
        
        // Prevent librarians from renewing membership
        if (isLibrarian(user)) {
            throw new IllegalArgumentException("Thủ thư không có gói thành viên");
        }
        
        applyMembershipLifecycle(user);

        MembershipType currentMembership = user.getMembershipType();
        if (currentMembership == null || !currentMembership.isPaid()) {
            throw new IllegalArgumentException("Chỉ có thể gia hạn gói trả phí");
        }

        String packageName = currentMembership.getName();
        user.setMembershipActivatedAt(LocalDateTime.now());
        user.setMembershipExpiresAt(LocalDateTime.now().plusYears(MEMBERSHIP_VALID_YEARS));
        user.setMembershipReminderSentAt(null);
        userRepository.save(user);

        recordTransaction(user, resolveActorUsername(), "RENEW", packageName, packageName,
                estimatePackagePrice(currentMembership), "Gia han goi thanh vien them 1 nam");

        createNotification(user,
                "Bạn đã gia hạn gói " + packageName + " thành công. Hiệu lực mới đến: " + user.getMembershipExpiresAt().toLocalDate());

        return new UpgradeMembershipResponse("Gia hạn gói thành công", packageName, packageName, true);
    }

    @Override
    public List<MembershipTransactionResponse> membershipTransactions(String username) {
        User targetUser = resolveTransactionTargetUser(username);
        applyMembershipLifecycle(targetUser);

        return membershipTransactionRepository.findByUserIdOrderByCreatedAtDesc(targetUser.getId()).stream()
                .map(profileMapper::toMembershipTransactionResponse)
                .toList();
    }

    private User resolveTransactionTargetUser(String usernameOverride) {
        User currentUser = userContextService.resolveUser(null);
        if (usernameOverride == null || usernameOverride.isBlank()
                || currentUser.getUsername().equalsIgnoreCase(usernameOverride)) {
            return currentUser;
        }

        boolean canViewOthers = currentUser.getRoles().stream()
                .map(Role::getName)
                .anyMatch(role -> "ROLE_LIBRARIAN".equals(role) || "ROLE_ADMIN".equals(role));

        if (!canViewOthers) {
            throw new IllegalArgumentException("Bạn không có quyền xem lịch sử giao dịch của tài khoản khác");
        }

        return userContextService.resolveUser(usernameOverride);
    }

    private void applyMembershipLifecycle(User user) {
        MembershipType membershipType = user.getMembershipType();
        if (membershipType == null || !membershipType.isPaid()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        if (user.getMembershipExpiresAt() == null) {
            user.setMembershipActivatedAt(now);
            user.setMembershipExpiresAt(now.plusYears(MEMBERSHIP_VALID_YEARS));
            user.setMembershipReminderSentAt(null);
            userRepository.save(user);
            return;
        }

        if (!now.isBefore(user.getMembershipExpiresAt())) {
            downgradeToFree(user, membershipType);
            return;
        }

        LocalDateTime reminderTime = user.getMembershipExpiresAt().minusDays(REMINDER_DAYS);
        if (!now.isBefore(reminderTime) && user.getMembershipReminderSentAt() == null) {
            createNotification(user,
                    "Gói " + membershipType.getName() + " sẽ hết hạn vào " + user.getMembershipExpiresAt().toLocalDate()
                            + ". Vui lòng gia hạn trước 1 tháng để giữ quyền lợi.");
            user.setMembershipReminderSentAt(now);
            userRepository.save(user);
        }
    }

    private void downgradeToFree(User user, MembershipType oldMembership) {
        MembershipType freeMembership = membershipTypeRepository.findByName("Free")
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy gói Free"));

        String fromPackage = oldMembership.getName();
        user.setMembershipType(freeMembership);
        user.setMembershipActivatedAt(null);
        user.setMembershipExpiresAt(null);
        user.setMembershipReminderSentAt(null);
        userRepository.save(user);

        recordTransaction(user, "SYSTEM", "AUTO_DOWNGRADE_EXPIRED", fromPackage, freeMembership.getName(), 0.0,
                "Het han 1 nam khong gia han");
        createNotification(user,
                "Gói " + fromPackage + " đã hết hạn và tài khoản đã được chuyển về Free. Bạn có thể nâng cấp lại bất cứ lúc nào.");
    }

    private void recordTransaction(User user, String actorUsername, String action, String fromPackage, String toPackage,
            Double amount, String note) {
        MembershipTransaction transaction = new MembershipTransaction();
        transaction.setUser(user);
        transaction.setActorUsername(actorUsername);
        transaction.setAction(action);
        transaction.setFromPackage(fromPackage);
        transaction.setToPackage(toPackage);
        transaction.setAmount(amount);
        transaction.setNote(note);
        membershipTransactionRepository.save(transaction);
    }

    private void createNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    private String resolveActorUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)
                && authentication.getName() != null) {
            return authentication.getName();
        }
        return "SYSTEM";
    }

    private double estimatePackagePrice(MembershipType membershipType) {
        if (membershipType == null || !membershipType.isPaid()) {
            return 0.0;
        }
        if ("Premium".equalsIgnoreCase(membershipType.getName())) {
            return 499000.0;
        }
        if ("Librarian Pro".equalsIgnoreCase(membershipType.getName())) {
            return 999000.0;
        }
        return 299000.0;
    }

    private boolean isLibrarian(User user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .anyMatch(name -> name.equals("ROLE_LIBRARIAN"));
    }
}
