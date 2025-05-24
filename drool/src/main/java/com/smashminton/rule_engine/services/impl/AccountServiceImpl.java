package com.smashminton.rule_engine.services.impl;

import com.smashminton.rule_engine.entities.Account;
import com.smashminton.rule_engine.repositories.AccountRepository;
import com.smashminton.rule_engine.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Override
    public Account getAccountById(Integer id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + id));
    }

    @Override
    public Account getAccountByUsername(String username) {
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            throw new EntityNotFoundException("Account not found with username: " + username);
        }
        return account;
    }

    @Override
    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public Account updateAccount(Integer id, Account accountDetails) {
        Account account = getAccountById(id);
        account.setUsername(accountDetails.getUsername());
        account.setPassword(accountDetails.getPassword());
        account.setStatus(accountDetails.getStatus());
        account.setFullName(accountDetails.getFullName());
        account.setEmail(accountDetails.getEmail());
        account.setDob(accountDetails.getDob());
        account.setGender(accountDetails.getGender());
        account.setPhoneNumber(accountDetails.getPhoneNumber());
        account.setAddress(accountDetails.getAddress());
        account.setAvatarUrl(accountDetails.getAvatarUrl());
        account.setAccountType(accountDetails.getAccountType());
        return accountRepository.save(account);
    }

    @Override
    public void deleteAccount(Integer id) {
        Account account = getAccountById(id);
        accountRepository.delete(account);
    }
} 