package com.example.demo.config;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Author;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.Category;
import com.example.demo.model.Location;
import com.example.demo.model.MembershipType;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.AuthorRepository;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.LocationRepository;
import com.example.demo.repository.MembershipTypeRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MembershipTypeRepository membershipTypeRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final BookRepository bookRepository;
    private final BookItemRepository bookItemRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Role memberRole = roleRepository.findByName("ROLE_MEMBER").orElseGet(() -> {
            Role role = new Role();
            role.setName("ROLE_MEMBER");
            return roleRepository.save(role);
        });

        roleRepository.findByName("ROLE_LIBRARIAN").orElseGet(() -> {
            Role role = new Role();
            role.setName("ROLE_LIBRARIAN");
            return roleRepository.save(role);
        });

        roleRepository.findByName("ROLE_GUEST").orElseGet(() -> {
            Role role = new Role();
            role.setName("ROLE_GUEST");
            return roleRepository.save(role);
        });

        Role librarianRole = roleRepository.findByName("ROLE_LIBRARIAN")
            .orElseThrow(() -> new IllegalStateException("Không tìm thấy ROLE_LIBRARIAN"));

        MembershipType freeMembership = membershipTypeRepository.findByName("Free").orElseGet(() -> {
            MembershipType membershipType = new MembershipType();
            membershipType.setName("Free");
            membershipType.setPaid(false);
            membershipType.setMaxBooks(3);
            membershipType.setBorrowDurationDays(14);
            membershipType.setFineRatePerDay(5000.0);
            membershipType.setPrivilegeNote("Goi mien phi cho doc gia co ban");
            return membershipTypeRepository.save(membershipType);
        });

        MembershipType premiumMembership = membershipTypeRepository.findByName("Premium").orElseGet(() -> {
            MembershipType membershipType = new MembershipType();
            membershipType.setName("Premium");
            membershipType.setPaid(true);
            membershipType.setMaxBooks(10);
            membershipType.setBorrowDurationDays(30);
            membershipType.setFineRatePerDay(2000.0);
            membershipType.setPrivilegeNote("Goi tra phi voi quyen loi mo rong va uu tien dat cho");
            return membershipTypeRepository.save(membershipType);
        });

        MembershipType librarianMembership = membershipTypeRepository.findByName("Librarian Pro").orElseGet(() -> {
            MembershipType membershipType = new MembershipType();
            membershipType.setName("Librarian Pro");
            membershipType.setPaid(true);
            membershipType.setMaxBooks(20);
            membershipType.setBorrowDurationDays(30);
            membershipType.setFineRatePerDay(0.0);
            membershipType.setPrivilegeNote("Goi nghiep vu danh cho thu thu");
            return membershipTypeRepository.save(membershipType);
        });

        User member = userRepository.findByUsername("reader01").orElseGet(() -> {
            User user = new User();
            user.setUsername("reader01");
            user.setPassword(passwordEncoder.encode("Reader@123"));
            user.setEmail("reader01@elib.local");
            user.setFullName("Nguyen Van Reader");
            user.setStudentId("SV10001");
            user.setActive(true);
            user.setRoles(Set.of(memberRole));
            user.setMembershipType(freeMembership);
            return userRepository.save(user);
        });

        if (member.getMembershipType() == null) {
            member.setMembershipType(freeMembership);
            userRepository.save(member);
        }

        User premiumMember = userRepository.findByUsername("readerplus01").orElseGet(() -> {
            User user = new User();
            user.setUsername("readerplus01");
            user.setPassword(passwordEncoder.encode("ReaderPlus@123"));
            user.setEmail("readerplus01@elib.local");
            user.setFullName("Le Thi Premium");
            user.setStudentId("SV20001");
            user.setActive(true);
            user.setRoles(Set.of(memberRole));
            user.setMembershipType(premiumMembership);
            return userRepository.save(user);
        });

        if (premiumMember.getMembershipType() == null) {
            premiumMember.setMembershipType(premiumMembership);
            userRepository.save(premiumMember);
        }
        if (premiumMember.getMembershipType() != null
                && premiumMember.getMembershipType().isPaid()
                && premiumMember.getMembershipExpiresAt() == null) {
            premiumMember.setMembershipActivatedAt(LocalDateTime.now());
            premiumMember.setMembershipExpiresAt(LocalDateTime.now().plusYears(1));
            premiumMember.setMembershipReminderSentAt(null);
            userRepository.save(premiumMember);
        }

        User librarian = userRepository.findByUsername("librarian01").orElseGet(() -> {
            User user = new User();
            user.setUsername("librarian01");
            user.setPassword(passwordEncoder.encode("Librarian@123"));
            user.setEmail("librarian01@elib.local");
            user.setFullName("Thu Thu Librarian");
            user.setActive(true);
            user.setRoles(Set.of(librarianRole));
            // Librarians do NOT have a membership type
            user.setMembershipType(null);
            return userRepository.save(user);
        });

        // No need to set membership for librarians

        seedCatalogData();
    }

    private void seedCatalogData() {
        if (bookRepository.count() > 0) {
            return;
        }

        Author martinFowler = createAuthor("Martin Fowler");
        Author robertMartin = createAuthor("Robert C. Martin");
        Author erichGamma = createAuthor("Erich Gamma");

        Category softwareEngineering = createCategory("Software Engineering");
        Category architecture = createCategory("Software Architecture");
        Category dataScience = createCategory("Data Science");

        Location khuA = createLocation("Khu A", "A1-01");
        Location khuB = createLocation("Khu B", "B2-03");
        Location khuC = createLocation("Khu C", "C3-07");

        Book refactoring = createBook(
                "Refactoring",
                "9780134757599",
                "Improving the design of existing code",
                "Addison-Wesley",
                2018,
                "https://images-na.ssl-images-amazon.com/images/I/41jEbK-jG+L._SX396_BO1,204,203,200_.jpg",
                softwareEngineering,
                Set.of(martinFowler),
                false);

        Book cleanCode = createBook(
                "Clean Code",
                "9780132350884",
                "A handbook of agile software craftsmanship",
                "Prentice Hall",
                2008,
                "https://images-na.ssl-images-amazon.com/images/I/41SH-SvWPxL._SX374_BO1,204,203,200_.jpg",
                softwareEngineering,
                Set.of(robertMartin),
                false);

        Book designPatterns = createBook(
                "Design Patterns",
                "9780201633610",
                "Elements of reusable object-oriented software",
                "Addison-Wesley",
                1994,
                "https://images-na.ssl-images-amazon.com/images/I/51kuc0iWoPL._SX342_SY445_QL70_ML2_.jpg",
                architecture,
                Set.of(erichGamma),
                false);

        Book distributedNotes = createBook(
                "Distributed Systems Notes",
                "DIGI-2026-001",
                "Digital document for distributed systems",
                "E-Library",
                2026,
                "",
                dataScience,
                Set.of(martinFowler),
                true);

        createBookItem("BC-10001", refactoring, khuA, BookStatus.AVAILABLE);
        createBookItem("BC-10002", refactoring, khuA, BookStatus.BORROWING);
        createBookItem("BC-20001", cleanCode, khuB, BookStatus.AVAILABLE);
        createBookItem("BC-20002", cleanCode, khuB, BookStatus.DAMAGED);
        createBookItem("BC-30001", designPatterns, khuC, BookStatus.AVAILABLE);
        createBookItem("BC-30002", designPatterns, khuC, BookStatus.LOST);
        createBookItem("BC-40001", distributedNotes, khuA, BookStatus.AVAILABLE);
    }

    private Author createAuthor(String name) {
        Author author = new Author();
        author.setName(name);
        return authorRepository.save(author);
    }

    private Category createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        return categoryRepository.save(category);
    }

    private Location createLocation(String roomName, String shelfNumber) {
        Location location = new Location();
        location.setRoomName(roomName);
        location.setShelfNumber(shelfNumber);
        return locationRepository.save(location);
    }

    private Book createBook(
            String title,
            String isbn,
            String description,
            String publisher,
            int publishYear,
            String coverImageUrl,
            Category category,
            Set<Author> authors,
            boolean isDigital) {
        Book book = new Book();
        book.setTitle(title);
        book.setIsbn(isbn);
        book.setDescription(description);
        book.setPublisher(publisher);
        book.setPublishYear(publishYear);
        book.setCoverImageUrl(coverImageUrl);
        book.setCategory(category);
        book.setAuthors(authors);
        book.setDigital(isDigital);
        book.setCanTakeHome(!isDigital);
        return bookRepository.save(book);
    }

    private void createBookItem(String barcode, Book book, Location location, BookStatus status) {
        BookItem item = new BookItem();
        item.setBarcode(barcode);
        item.setBook(book);
        item.setLocation(location);
        item.setStatus(status);
        bookItemRepository.save(item);
    }
}

