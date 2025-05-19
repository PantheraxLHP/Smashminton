package com.smashminton.rule_engine.services;

import com.smashminton.rule_engine.entities.Account;
import java.util.List;

public interface AccountService {
    List<Account> getAllAccounts();
    Account getAccountById(Integer id);
    Account getAccountByUsername(String username);
    Account createAccount(Account account);
    Account updateAccount(Integer id, Account account);
    void deleteAccount(Integer id);
} 