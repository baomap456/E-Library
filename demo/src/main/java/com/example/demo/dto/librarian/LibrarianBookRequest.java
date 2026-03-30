package com.example.demo.dto.librarian;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record LibrarianBookRequest(
        @NotBlank(message = "title không được để trống")
        @Size(max = 255, message = "title tối đa 255 ký tự")
        String title,
        @Size(max = 4000, message = "description tối đa 4000 ký tự")
        String description,
        @Positive(message = "publishYear phải lớn hơn 0")
        Integer publishYear,
        @Size(max = 255, message = "publisher tối đa 255 ký tự")
        String publisher,
        @Size(max = 1000, message = "coverImageUrl tối đa 1000 ký tự")
        String coverImageUrl,
        Boolean digital) {
}
