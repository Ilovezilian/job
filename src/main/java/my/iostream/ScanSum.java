package my.iostream;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Scanner;

/**
 * Created by Ilovezilian on 2017/11/12.
 */
public class ScanSum {
    public static void main(String[] args) throws FileNotFoundException {
        double sum = 0;
        try (Scanner s = new Scanner(new BufferedReader(new FileReader("usnumber.txt")))) {
            while (s.hasNext()) {
                if (s.hasNextDouble()) {
                    sum += s.nextDouble();
                } else {
                    System.out.println("not a double value = " + s.next());
                }
            }

            System.out.println("sum of double value = " + sum);
            System.out.printf("sum of double value = %f%n", sum);
            System.out.format("sum of double value = %f%n", sum);
        }
    }
}
