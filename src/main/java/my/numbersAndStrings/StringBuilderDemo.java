package my.numbersAndStrings;

/**
 * Created by Ilovezilian on 2017/8/27.
 */
public class StringBuilderDemo {
    public static void main(String[] args) {
        String palindrome = "Dot saw I was Tod";

        StringBuilder sb = new StringBuilder(palindrome);
        new StringBuilder();

        sb.reverse();  // reverse it

        System.out.println(sb);
    }
}
