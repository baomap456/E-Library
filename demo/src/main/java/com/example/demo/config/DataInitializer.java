package com.example.demo.config;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.model.Author;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.Category;
import com.example.demo.model.Location;
import com.example.demo.model.Notification;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.AuthorRepository;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.LocationRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final BookItemRepository bookItemRepository;
    private final LocationRepository locationRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final NotificationRepository notificationRepository;

    @Override
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

        Role librarianRole = roleRepository.findByName("ROLE_LIBRARIAN")
            .orElseThrow(() -> new IllegalStateException("Không tìm thấy ROLE_LIBRARIAN"));

        User member = userRepository.findByUsername("reader01").orElseGet(() -> {
            User user = new User();
            user.setUsername("reader01");
            user.setPassword(passwordEncoder.encode("Reader@123"));
            user.setEmail("reader01@elib.local");
            user.setFullName("Nguyen Van Reader");
            user.setStudentId("SV10001");
            user.setActive(true);
            user.setRoles(Set.of(memberRole));
            return userRepository.save(user);
        });

        userRepository.findByUsername("librarian01").orElseGet(() -> {
            User user = new User();
            user.setUsername("librarian01");
            user.setPassword(passwordEncoder.encode("Librarian@123"));
            user.setEmail("librarian01@elib.local");
            user.setFullName("Thu Thu Librarian");
            user.setActive(true);
            user.setRoles(Set.of(librarianRole));
            return userRepository.save(user);
        });

        if (bookRepository.count() > 0) {
            return;
        }

        Author author = new Author();
        author.setName("Martin Fowler");
        author = authorRepository.save(author);

        Category category = new Category();
        category.setName("Software Engineering");
        category = categoryRepository.save(category);

        Location location = new Location();
        location.setRoomName("Khu B");
        location.setShelfNumber("B2-01");
        location = locationRepository.save(location);

        Book book = new Book();
        book.setTitle("Refactoring");
        book.setIsbn("9780134757599");
        book.setDescription("Improving the design of existing code");
        book.setPublisher("Addison-Wesley");
        book.setPublishYear(2018);
        book.setCoverImageUrl("https://images-na.ssl-images-amazon.com/images/I/41jEbK-jG+L._SX396_BO1,204,203,200_.jpg");
        book.setCategory(category);
        book.setAuthors(Set.of(author));
        book = bookRepository.save(book);

        Book digitalBook = new Book();
        digitalBook.setTitle("Distributed Systems Notes");
        digitalBook.setIsbn("DIGI-2026-001");
        digitalBook.setDescription("Digital document for distributed systems");
        digitalBook.setPublisher("E-Library");
        digitalBook.setPublishYear(2026);
        digitalBook.setDigital(true);
        digitalBook.setCategory(category);
        digitalBook.setAuthors(Set.of(author));
        bookRepository.save(digitalBook);

        BookItem bookItem = new BookItem();
        bookItem.setBarcode("BC-00001");
        bookItem.setBook(book);
        bookItem.setLocation(location);
        bookItem.setStatus(BookStatus.AVAILABLE);
        bookItem = bookItemRepository.save(bookItem);

        BorrowRecord record = new BorrowRecord();
        record.setUser(member);
        record.setBookItem(bookItem);
        record.setBorrowDate(LocalDateTime.now().minusDays(3));
        record.setDueDate(LocalDateTime.now().plusDays(7));
        record.setStatus(BookStatus.BORROWING);
        record.setFineAmount(0.0);
        borrowRecordRepository.save(record);

        Notification notification = new Notification();
        notification.setUser(member);
        notification.setMessage("Sách Refactoring sẽ hết hạn trong 7 ngày tới.");
        notification.setRead(false);
        notificationRepository.save(notification);
    }
}
