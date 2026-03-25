package com.example.demo.repository;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import com.example.demo.model.Author;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.Category;
import com.example.demo.model.Role;
import com.example.demo.model.User;

import java.time.LocalDateTime;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class EntityMappingTest {

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void testUserAndRoleMapping() {
        // 1. Tạo Role
        Role adminRole = new Role();
        adminRole.setName("ROLE_ADMIN");
        adminRole = entityManager.persist(adminRole);

        // 2. Tạo User và gắn Role
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password123");
        user.setEmail("test@dnck.com");
        user.setRoles(Set.of(adminRole));

        User savedUser = entityManager.persist(user);
        entityManager.flush();

        // Kiểm tra
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getRoles()).hasSize(1);
        assertThat(savedUser.getRoles().iterator().next().getName()).isEqualTo("ROLE_ADMIN");
    }

    @Test
    void testBookAndCatalogMapping() {
        // 1. Tạo Category
        Category category = new Category();
        category.setName("Công nghệ thông tin");
        category = entityManager.persist(category);

        // 2. Tạo Author
        Author author = new Author();
        author.setName("Robert C. Martin");
        author = entityManager.persist(author);

        // 3. Tạo Book
        Book book = new Book();
        book.setTitle("Clean Code");
        book.setIsbn("978-0132350884");
        book.setCategory(category);
        book.setAuthors(Set.of(author));

        Book savedBook = entityManager.persist(book);
        entityManager.flush();

        // Kiểm tra
        assertThat(savedBook.getId()).isNotNull();
        assertThat(savedBook.getCategory().getName()).isEqualTo("Công nghệ thông tin");
        assertThat(savedBook.getAuthors()).hasSize(1);
    }

    @Test
    void testBorrowRecordMapping() {
        // 1. Tạo dữ liệu mẫu nhanh (User, Book, BookItem)
        User user = new User();
        user.setUsername("borrower");
        user.setPassword("123");
        user.setEmail("borrower@dnck.com");
        entityManager.persist(user);

        Book book = new Book();
        book.setTitle("Java Programming");
        entityManager.persist(book);

        BookItem item = new BookItem();
        item.setBarcode("BC-12345");
        item.setBook(book);
        item.setStatus(BookStatus.AVAILABLE);
        entityManager.persist(item);

        // 2. Tạo bản ghi mượn sách
        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBookItem(item);
        record.setDueDate(LocalDateTime.now().plusDays(14));
        record.setStatus(BookStatus.BORROWING);

        BorrowRecord savedRecord = entityManager.persist(record);
        entityManager.flush();

        // Kiểm tra logic quan hệ
        assertThat(savedRecord.getId()).isNotNull();
        assertThat(savedRecord.getUser().getUsername()).isEqualTo("borrower");
        assertThat(savedRecord.getBookItem().getBarcode()).isEqualTo("BC-12345");
    }
}