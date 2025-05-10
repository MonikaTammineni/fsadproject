package com.monikatammineni.fsadproject.jwt;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;

@Component
public class TokenHelper {
    static Key secretKey = io.jsonwebtoken.security.Keys.secretKeyFor(SignatureAlgorithm.HS256);

    @Value("${jwt.issuer}")
    private String issuer;


    public String createToken(int id, String mobileNumber, String account_type) {
        HashMap<String, Object> payload = new HashMap<>();
        payload.put("id", id);
        payload.put("mobileNumber", mobileNumber);
        payload.put("account_type", account_type);
        Date now = new Date();
//        Date expiration = new Date(now.getTime() +
//                1800000); // 30 mins
        //make it 24 hours
        Date expiration = new Date(now.getTime() + 86400000); // 24 hours


        String token = Jwts.builder()
                .setClaims(payload)
                .issuer(issuer)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
        return token;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            System.out.println("Invalid token");
            return false;
        }
    }

    public static Claims getClaims(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();  // Use getBody() to retrieve the payload
            return claims;
        } catch (SignatureException e) {
            System.out.println("Invalid token");
            return null;
        }


    }
}