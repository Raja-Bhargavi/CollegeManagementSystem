// package college_management_backend.util;

// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// public class PasswordHashGenerator {

//     public static void main(String[] args) {

//         BCryptPasswordEncoder encoder =
//                 new BCryptPasswordEncoder();

//         String password = "Admin@123";

//         String hash = encoder.encode(password);

//         System.out.println("Password: " + password);
//         System.out.println("BCrypt Hash: " + hash);
//     }
// }


package college_management_backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String[] passwords = {
                "Admin@123",
                "Faculty@123",
                "Student@123",
                "Staff@123",
                "Management@123"
        };

        for (String password : passwords) {
            System.out.println("Password: " + password);
            System.out.println("BCrypt Hash: " + encoder.encode(password));
            System.out.println();
        }
    }
}