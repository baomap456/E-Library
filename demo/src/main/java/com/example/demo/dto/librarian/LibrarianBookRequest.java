package com.example.demo.dto.librarian;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
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
        @PositiveOrZero(message = "price phải lớn hơn hoặc bằng 0")
        Double price,
        @Size(max = 1000, message = "coverImageUrl tối đa 1000 ký tự")
        String coverImageUrl,
        Boolean digital,
        @NotEmpty(message = "authorIds không được để trống")
        List<Integer> authorIds,
        @NotNull(message = "categoryId không được để trống")
        Integer categoryId,
        Integer locationId) {
}
