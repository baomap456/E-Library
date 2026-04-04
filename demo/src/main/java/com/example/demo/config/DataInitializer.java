package com.example.demo.config;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
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
    private final JdbcTemplate jdbcTemplate;

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

        ensureBookItemStatusEnum();
        // Catalog data is loaded via data.sql on application startup
        // seedCatalogData();
    }

    private void ensureBookItemStatusEnum() {
        jdbcTemplate.execute("""
                ALTER TABLE book_items
                MODIFY COLUMN status ENUM(
                    'AVAILABLE',
                    'RESERVED',
                    'BORROWING',
                    'OVERDUE',
                    'LOST',
                    'DAMAGED',
                    'DISCARDED'
                ) NULL
                """);
    }

    private void seedCatalogData() {
        String[] authorNames = {
            "Martin Fowler", "Robert C. Martin", "Erich Gamma", "Andrew Hunt", "David Thomas",
            "Kent Beck", "Eric Evans", "Robert Martin", "Martin Kleppmann", "Thomas H. Cormen",
            "Brian W. Kernighan", "Dennis M. Ritchie", "Herbert Schildt", "Joshua Bloch", "Yukihiro Matsumoto",
            "Bjarne Stroustrup", "Kyle Simpson", "Douglas Crockford", "Addy Osmani", "Sebastian Raschka",
            "Aurélien Géron", "Ian Goodfellow", "François Chollet", "Yuval Noah Harari", "Stephen Hawking",
            "George Orwell", "J.K. Rowling", "Jane Austen", "Paulo Coelho", "Murakami Haruki"
        };

        String[] categoryNames = {
            "Software Engineering", "Software Architecture", "Data Science", "Artificial Intelligence", "Machine Learning",
            "Web Development", "Mobile Development", "Cloud Computing", "Cybersecurity", "DevOps",
            "Databases", "Operating Systems", "Computer Networks", "Algorithms", "Programming Languages",
            "Project Management", "Business Analysis", "Literature", "Science Fiction", "History",
            "Economics", "Psychology", "Mathematics", "Physics", "Philosophy",
            "Education", "Self-Help", "Design", "Digital Transformation", "Library Science"
        };

        String[][] locationData = {
            {"Khu A", "A1-01"}, {"Khu A", "A1-02"}, {"Khu A", "A1-03"}, {"Khu A", "A2-01"}, {"Khu A", "A2-02"},
            {"Khu B", "B1-01"}, {"Khu B", "B1-02"}, {"Khu B", "B1-03"}, {"Khu B", "B2-01"}, {"Khu B", "B2-02"},
            {"Khu C", "C1-01"}, {"Khu C", "C1-02"}, {"Khu C", "C1-03"}, {"Khu C", "C2-01"}, {"Khu C", "C2-02"},
            {"Khu D", "D1-01"}, {"Khu D", "D1-02"}, {"Khu D", "D1-03"}, {"Khu D", "D2-01"}, {"Khu D", "D2-02"},
            {"Khu E", "E1-01"}, {"Khu E", "E1-02"}, {"Khu E", "E1-03"}, {"Khu E", "E2-01"}, {"Khu E", "E2-02"},
            {"Kho số", "DIGI-01"}, {"Kho số", "DIGI-02"}, {"Kho số", "DIGI-03"}, {"Kho lưu trữ", "ARC-01"}, {"Kho lưu trữ", "ARC-02"}
        };

        List<Author> authors = new ArrayList<>();
        for (String authorName : authorNames) {
            authors.add(createAuthor(authorName));
        }

        List<Category> categories = new ArrayList<>();
        for (String categoryName : categoryNames) {
            categories.add(createCategory(categoryName));
        }

        List<Location> locations = new ArrayList<>();
        for (String[] location : locationData) {
            locations.add(createLocation(location[0], location[1]));
        }

        Map<String, Author> authorByName = authors.stream()
            .collect(Collectors.toMap(Author::getName, Function.identity()));
        Map<String, Category> categoryByName = categories.stream()
            .collect(Collectors.toMap(Category::getName, Function.identity()));

        List<Book> books = new ArrayList<>();
        books.add(createBook("Refactoring", "9780134757599", "Improving the design of existing code",
            "Addison-Wesley", 2018, "https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg",
            category(categoryByName, "Software Engineering"), Set.of(author(authorByName, "Martin Fowler")), false));
        books.add(createBook("Clean Code", "9780132350884", "A handbook of agile software craftsmanship",
            "Prentice Hall", 2008, "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
            category(categoryByName, "Software Engineering"), Set.of(author(authorByName, "Robert C. Martin")), false));
        books.add(createBook("Design Patterns", "9780201633610", "Elements of reusable object-oriented software",
            "Addison-Wesley", 1994, "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg",
            category(categoryByName, "Software Architecture"), Set.of(author(authorByName, "Erich Gamma")), false));
        books.add(createBook("The Pragmatic Programmer", "9780135957059", "Journey to mastery for modern developers",
            "Addison-Wesley", 2019, "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg",
            category(categoryByName, "Software Engineering"),
            Set.of(author(authorByName, "Andrew Hunt"), author(authorByName, "David Thomas")), false));
        books.add(createBook("Test Driven Development", "9780321146533", "By example with practical coding techniques",
            "Addison-Wesley", 2002, "https://covers.openlibrary.org/b/isbn/9780321146533-L.jpg",
            category(categoryByName, "Software Engineering"), Set.of(author(authorByName, "Kent Beck")), false));
        books.add(createBook("Domain-Driven Design", "9780321125217", "Tackling complexity in the heart of software",
            "Addison-Wesley", 2003, "https://covers.openlibrary.org/b/isbn/9780321125217-L.jpg",
            category(categoryByName, "Software Architecture"), Set.of(author(authorByName, "Eric Evans")), false));
        books.add(createBook("Clean Architecture", "9780134494166", "A craftsman's guide to software structure and design",
            "Prentice Hall", 2017, "https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg",
            category(categoryByName, "Software Architecture"), Set.of(author(authorByName, "Robert Martin")), false));
        books.add(createBook("Designing Data-Intensive Applications", "9781449373320", "Reliable and scalable systems",
            "O'Reilly Media", 2017, "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg",
            category(categoryByName, "Data Science"), Set.of(author(authorByName, "Martin Kleppmann")), false));
        books.add(createBook("Introduction to Algorithms", "9780262033848", "Comprehensive guide to algorithms",
            "MIT Press", 2009, "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg",
            category(categoryByName, "Algorithms"), Set.of(author(authorByName, "Thomas H. Cormen")), false));
        books.add(createBook("The C Programming Language", "9780131103627", "Foundational programming text",
            "Prentice Hall", 1988, "https://covers.openlibrary.org/b/isbn/9780131103627-L.jpg",
            category(categoryByName, "Programming Languages"),
            Set.of(author(authorByName, "Brian W. Kernighan"), author(authorByName, "Dennis M. Ritchie")), false));
        books.add(createBook("Java: The Complete Reference", "9781260440232", "Comprehensive Java guide",
            "McGraw-Hill", 2018, "https://covers.openlibrary.org/b/isbn/9781260440232-L.jpg",
            category(categoryByName, "Programming Languages"), Set.of(author(authorByName, "Herbert Schildt")), false));
        books.add(createBook("Effective Java", "9780134685991", "Best practices for the Java platform",
            "Addison-Wesley", 2018, "https://covers.openlibrary.org/b/isbn/9780134685991-L.jpg",
            category(categoryByName, "Programming Languages"), Set.of(author(authorByName, "Joshua Bloch")), false));
        books.add(createBook("The Ruby Programming Language", "9780596516178", "Ruby fundamentals and advanced patterns",
            "O'Reilly Media", 2008, "https://covers.openlibrary.org/b/isbn/9780596516178-L.jpg",
            category(categoryByName, "Programming Languages"), Set.of(author(authorByName, "Yukihiro Matsumoto")), false));
        books.add(createBook("The C++ Programming Language", "9780321563842", "Definitive C++ reference",
            "Addison-Wesley", 2013, "https://covers.openlibrary.org/b/isbn/9780321563842-L.jpg",
            category(categoryByName, "Programming Languages"), Set.of(author(authorByName, "Bjarne Stroustrup")), false));
        books.add(createBook("You Don't Know JS: Scope & Closures", "9781449335588", "Deep dive into JavaScript mechanics",
            "O'Reilly Media", 2014, "https://covers.openlibrary.org/b/isbn/9781449335588-L.jpg",
            category(categoryByName, "Web Development"), Set.of(author(authorByName, "Kyle Simpson")), false));
        books.add(createBook("JavaScript: The Good Parts", "9780596517748", "Elegant JavaScript techniques",
            "O'Reilly Media", 2008, "https://covers.openlibrary.org/b/isbn/9780596517748-L.jpg",
            category(categoryByName, "Web Development"), Set.of(author(authorByName, "Douglas Crockford")), false));
        books.add(createBook("Learning JavaScript Design Patterns", "9781449331818", "Reusable patterns for JS applications",
            "O'Reilly Media", 2012, "https://covers.openlibrary.org/b/isbn/9781449331818-L.jpg",
            category(categoryByName, "Web Development"), Set.of(author(authorByName, "Addy Osmani")), false));
        books.add(createBook("Python Machine Learning", "9781789955750", "Machine learning and deep learning with Python",
            "Packt", 2019, "https://covers.openlibrary.org/b/isbn/9781789955750-L.jpg",
            category(categoryByName, "Machine Learning"), Set.of(author(authorByName, "Sebastian Raschka")), false));
        books.add(createBook("Hands-On Machine Learning", "9781492032649", "Scikit-Learn, Keras and TensorFlow",
            "O'Reilly Media", 2019, "https://covers.openlibrary.org/b/isbn/9781492032649-L.jpg",
            category(categoryByName, "Machine Learning"), Set.of(author(authorByName, "Aurélien Géron")), false));
        books.add(createBook("Deep Learning", "9780262035613", "Comprehensive deep learning textbook",
            "MIT Press", 2016, "https://covers.openlibrary.org/b/isbn/9780262035613-L.jpg",
            category(categoryByName, "Artificial Intelligence"), Set.of(author(authorByName, "Ian Goodfellow")), false));
        books.add(createBook("Deep Learning with Python", "9781617294433", "Practical deep learning using Keras",
            "Manning", 2018, "https://covers.openlibrary.org/b/isbn/9781617294433-L.jpg",
            category(categoryByName, "Artificial Intelligence"), Set.of(author(authorByName, "François Chollet")), false));
        books.add(createBook("Sapiens", "9780062316097", "A brief history of humankind",
            "Harper", 2015, "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
            category(categoryByName, "History"), Set.of(author(authorByName, "Yuval Noah Harari")), false));
        books.add(createBook("A Brief History of Time", "9780553380163", "From the Big Bang to black holes",
            "Bantam", 1998, "https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg",
            category(categoryByName, "Physics"), Set.of(author(authorByName, "Stephen Hawking")), false));
        books.add(createBook("1984", "9780451524935", "Dystopian novel on surveillance and control",
            "Signet Classics", 1950, "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
            category(categoryByName, "Literature"), Set.of(author(authorByName, "George Orwell")), false));
        books.add(createBook("Harry Potter and the Sorcerer's Stone", "9780590353427", "Fantasy novel introducing Harry Potter",
            "Scholastic", 1998, "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg",
            category(categoryByName, "Science Fiction"), Set.of(author(authorByName, "J.K. Rowling")), false));
        books.add(createBook("Pride and Prejudice", "9780141439518", "Classic English romance novel",
            "Penguin Classics", 2002, "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
            category(categoryByName, "Literature"), Set.of(author(authorByName, "Jane Austen")), false));
        books.add(createBook("The Alchemist", "9780062315007", "A philosophical story of following dreams",
            "HarperOne", 2014, "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
            category(categoryByName, "Self-Help"), Set.of(author(authorByName, "Paulo Coelho")), false));
        books.add(createBook("Norwegian Wood", "9780375704024", "Coming-of-age novel by Haruki Murakami",
            "Vintage", 2000, "https://covers.openlibrary.org/b/isbn/9780375704024-L.jpg",
            category(categoryByName, "Literature"), Set.of(author(authorByName, "Murakami Haruki")), false));
        books.add(createBook("Cloud Native Patterns", "9781617294297", "Designing change-tolerant software",
            "Manning", 2019, "https://covers.openlibrary.org/b/isbn/9781617294297-L.jpg",
            category(categoryByName, "Cloud Computing"), Set.of(author(authorByName, "Martin Fowler")), true));
        books.add(createBook("DevOps Handbook", "9781942788003", "How to create world-class agility and reliability",
            "IT Revolution", 2016, "https://covers.openlibrary.org/b/isbn/9781942788003-L.jpg",
            category(categoryByName, "DevOps"), Set.of(author(authorByName, "Martin Fowler")), true));

        for (int i = 0; i < books.size(); i++) {
            BookStatus status;
            switch (i % 8) {
            case 1 -> status = BookStatus.BORROWING;
            case 2 -> status = BookStatus.RESERVED;
            case 3 -> status = BookStatus.OVERDUE;
            case 4 -> status = BookStatus.DAMAGED;
            case 5 -> status = BookStatus.LOST;
            case 6 -> status = BookStatus.AVAILABLE;
            case 7 -> status = BookStatus.BORROWING;
            default -> status = BookStatus.AVAILABLE;
            }

            createBookItem(
                String.format("BC-%05d", 50001 + i),
                books.get(i),
                locations.get(i % locations.size()),
                status);
        }
    }

    private Author author(Map<String, Author> authorByName, String name) {
        Author author = authorByName.get(name);
        if (author == null) {
            throw new IllegalStateException("Missing author seed data: " + name);
        }
        return author;
    }

    private Category category(Map<String, Category> categoryByName, String name) {
        Category category = categoryByName.get(name);
        if (category == null) {
            throw new IllegalStateException("Missing category seed data: " + name);
        }
        return category;
    }

    private Author createAuthor(String name) {
        Author author = authorRepository.findByName(name).orElseGet(Author::new);
        author.setName(name);
        return authorRepository.save(author);
    }

    private Category createCategory(String name) {
        Category category = categoryRepository.findByName(name).orElseGet(Category::new);
        category.setName(name);
        return categoryRepository.save(category);
    }

    private Location createLocation(String roomName, String shelfNumber) {
        Location location = locationRepository
                .findByRoomNameAndShelfNumber(roomName, shelfNumber)
                .orElseGet(Location::new);
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
        Book book = bookRepository.findByIsbn(isbn).orElseGet(Book::new);
        book.setTitle(title);
        book.setIsbn(isbn);
        book.setDescription(description);
        book.setPublisher(publisher);
        book.setPublishYear(publishYear);
        book.setCoverImageUrl(coverImageUrl);
        book.setCategory(category);
        // Hibernate merge may clear and repopulate this collection, so it must be mutable.
        book.setAuthors(new HashSet<>(authors));
        book.setDigital(isDigital);
        book.setCanTakeHome(!isDigital);
        return bookRepository.save(book);
    }

    private void createBookItem(String barcode, Book book, Location location, BookStatus status) {
        BookItem item = bookItemRepository.findByBarcode(barcode).orElseGet(BookItem::new);
        item.setBarcode(barcode);
        item.setBook(book);
        item.setLocation(location);
        item.setStatus(status);
        bookItemRepository.save(item);
    }
}

