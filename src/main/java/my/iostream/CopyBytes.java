package my.iostream;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by Ilovezilian on 2017/11/12.
 */
public class CopyBytes {
    public static void main(String[] args) throws IOException {
        FileInputStream fi = null;
        FileOutputStream fo = null;
        try {

            fi = new FileInputStream("input.md");
            fo = new FileOutputStream("output.md");

            int c;
            while ((c = fi.read()) != -1) {
                fo.write(c);
            }
        } finally {
            if (null != fi) {
                fi.close();
            }
            if (null != fo) {
                fo.close();
            }
        }
    }
}
