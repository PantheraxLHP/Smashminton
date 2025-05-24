package com.smashminton.rule_engine.controllers;

import com.smashminton.rule_engine.entities.Account;
import com.smashminton.rule_engine.services.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Account Management", description = "APIs for managing accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    @Operation(
        summary = "Get all accounts",
        description = "Retrieves a list of all accounts in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved all accounts",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Account.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get account by ID",
        description = "Retrieves an account by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the account",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Account.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Account not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Account> getAccountById(
            @Parameter(description = "Account ID", required = true, example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @GetMapping("/username/{username}")
    @Operation(
        summary = "Get account by username",
        description = "Retrieves an account by its username"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved the account",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Account.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Account not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Account> getAccountByUsername(
            @Parameter(description = "Username", required = true, example = "john.doe")
            @PathVariable String username) {
        return ResponseEntity.ok(accountService.getAccountByUsername(username));
    }

    @PostMapping
    @Operation(
        summary = "Create new account",
        description = "Creates a new account in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully created the account",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Account.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Account> createAccount(
            @Parameter(description = "Account object", required = true)
            @RequestBody Account account) {
        return ResponseEntity.ok(accountService.createAccount(account));
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Update account",
        description = "Updates an existing account"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully updated the account",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Account.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Account not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Account> updateAccount(
            @Parameter(description = "Account ID", required = true, example = "1")
            @PathVariable Integer id,
            @Parameter(description = "Updated account object", required = true)
            @RequestBody Account account) {
        return ResponseEntity.ok(accountService.updateAccount(id, account));
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete account",
        description = "Deletes an account by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully deleted the account"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Account not found"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public ResponseEntity<Void> deleteAccount(
            @Parameter(description = "Account ID", required = true, example = "1")
            @PathVariable Integer id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok().build();
    }
} 