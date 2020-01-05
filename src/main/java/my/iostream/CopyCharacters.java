package my.iostream;

import java.io.*;

/**
 * Created by Ilovezilian on 2017/11/12.
 */
public class CopyCharacters {
    public static void main(String[] args) throws IOException {
        BufferedReader in = null;
        PrintWriter out = null;

        try {
            in = new BufferedReader(new FileReader("input.md"));
            out = new PrintWriter(new FileWriter("output.md"));

         String line;
         while ((line = in.readLine()) != null) {
             out.println(line);
         }

        } finally {
            if (null != in) {
                in.close();
            }
            if (null != out) {
                out.close();
            }
        }

        copyCharactersByCharactersStream();
    }

    private static void copyCharactersByCharactersStream() throws IOException {
        FileReader in = null;
        FileWriter out = null;

        try {
            in = new FileReader("input.md");
            out = new FileWriter("output.md");

            int c;
            while ((c = in.read()) != -1) {
                out.write(c);
            }

        } finally {
            if (null != in) {
                in.close();
            }
            if (null != out) {
                out.close();
            }
        }
    }
}
