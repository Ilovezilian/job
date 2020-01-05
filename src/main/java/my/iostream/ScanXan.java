package my.iostream;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Scanner;

/**
 * Created by Ilovezilian on 2017/11/12.
 */
public class ScanXan {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner s = null;

        try {
            s = new Scanner(new BufferedReader(new FileReader("input.md")));

            s.useDelimiter(",\\s*");

            while (s.hasNext()) {
                System.out.println(s.next());
            }
        } finally {
            if (null != s) {
                s.close();
            }
        }

    }
}
