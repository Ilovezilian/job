package my.fun;

public class PalindromeNumber {
    public static void main(String[] args) {
        System.out.println(new PalindromeNumber().isPalindrome(0) + "0");
        System.out.println(new PalindromeNumber().isPalindrome(1) + "1");
        System.out.println(new PalindromeNumber().isPalindrome(11) + "11");
        System.out.println(new PalindromeNumber().isPalindrome(12) + "12");
        System.out.println(new PalindromeNumber().isPalindrome(111) + "111");
        System.out.println(new PalindromeNumber().isPalindrome(123) + "123");
        System.out.println(new PalindromeNumber().isPalindrome(1221) + "1221");
        System.out.println(new PalindromeNumber().isPalindrome(1234) + "1234");
        System.out.println(new PalindromeNumber().isPalindrome(12321) + "12321");
        System.out.println(new PalindromeNumber().isPalindrome(12345) + "12345");
        System.out.println(new PalindromeNumber().isPalindrome(123321) + "123321");
        System.out.println(new PalindromeNumber().isPalindrome(123456) + "123456");
        System.out.println(new PalindromeNumber().isPalindrome(1234321) + "1234321");
        System.out.println(new PalindromeNumber().isPalindrome(1234567) + "1234567");
        System.out.println(new PalindromeNumber().isPalindrome(12344321) + "12344321");
        System.out.println(new PalindromeNumber().isPalindrome(12345678) + "12345678");
        System.out.println(new PalindromeNumber().isPalindrome(123454321) + "123454321");
        System.out.println(new PalindromeNumber().isPalindrome(123456789) + "123456789");
        System.out.println(new PalindromeNumber().isPalindrome(1234554321) + "1234554321");
        System.out.println(new PalindromeNumber().isPalindrome(1234567891) + "1234567891");
        System.out.println(new PalindromeNumber().isPalindrome(-1234554321) + "-1234554321");
        System.out.println(new PalindromeNumber().isPalindrome(-1234567891) + "-1234567891");
    }

    public boolean isPalindrome(int x) {
        if (x < 0) {
            return false;
        }
            //2147483647
        if (x / 1000000000 != 0) {
            if (
                    x / 1000000000 == x % 10 &&
                    x % 1000000000 / 100000000 == x % 100/ 10 &&
                    x % 100000000 / 10000000 == x % 1000 /100 &&
                    x % 10000000 / 1000000 == x % 10000 / 1000 &&
                    x % 1000000 / 100000 == x % 100000 /10000
                    ) {
                return true;
            } else {
                return false;
            }
        }
        if (x / 100000000 != 0) {
            if (
                    x / 100000000 == x % 10 &&
                    x % 100000000 / 10000000 == x % 100/ 10 &&
                    x % 10000000 / 1000000 == x % 1000 /100 &&
                    x % 1000000 / 100000 == x % 10000 / 1000
                    ) {
                return true;
            } else {
                return false;
            }
        }
        if (x / 10000000 != 0) {
            if (
                    x / 10000000 == x % 10 &&
                    x % 10000000 / 1000000 == x % 100 /10 &&
                    x % 1000000 / 100000 == x % 1000 /100 &&
                    x % 100000 / 10000 == x % 10000 / 1000
                    ) {
                return true;
            } else {
                return false;
            }
        }
        if (x / 1000000 != 0) {
            if (
                    x / 1000000 == x % 10 &&
                    x % 1000000 / 100000== x % 100 /10 &&
                    x % 100000 / 10000 == x % 1000 / 100
                    ) {
                return true;
            } else {
                return false;
            }
        }
        if (x / 100000 != 0) {
            if (
                    x / 100000 == x % 10 &&
                    x % 100000 / 10000== x % 100 /10 &&
                    x % 10000 / 1000 == x % 1000 / 100
                    ) {
                return true;
            } else {
                return false;
            }
        }
        if (x / 10000 != 0) {
            if (
                    x / 10000 == x % 10 &&
                    x % 10000 / 1000 == x % 100 / 10
                    ) {
                return true;
            } else {
                return false;
            }
        }
        if (x / 1000 != 0) {

            if (
                    x / 1000 == x % 10 &&
                    x % 1000 / 100 == x % 100 / 10
                    ) {
                return true;
            } else {
                return false;
            }

        }
        if (x / 100 != 0) {
            if (x / 100 == x % 10) {
                return true;
            } else {
                return false;
            }
        }
        if (x / 10 != 0) {
            if (x / 10 == x % 10) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
}
