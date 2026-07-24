package com.enterprise.smartmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private String timestamp;
    private int status;
    private String message;
    private T data;
    private Object errors;

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(
                LocalDateTime.now().toString(),
                200,
                message,
                data,
                null
        );
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return new ApiResponse<>(
                LocalDateTime.now().toString(),
                201,
                message,
                data,
                null
        );
    }

    public static ApiResponse<Object> error(int status, String message) {
        return new ApiResponse<>(
                LocalDateTime.now().toString(),
                status,
                message,
                null,
                null
        );
    }

    public static <E> ApiResponse<E> error(int status, String message, E errors) {
        return new ApiResponse<>(
                LocalDateTime.now().toString(),
                status,
                message,
                null,
                errors
        );
    }
}
