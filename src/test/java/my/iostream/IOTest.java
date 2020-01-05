package my.iostream;

import org.junit.jupiter.api.Test;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.channels.SeekableByteChannel;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Created by Ilovezilian on 2017/11/18.
 */
public class IOTest {
    @Test
    void SnippetRads() {
        Path file = Paths.get("logfile.txt");
        try (SeekableByteChannel sbc = Files.newByteChannel(file)) {
            ByteBuffer buf =  ByteBuffer.allocate(10);

            String encoding = System.getProperty("file.encoding");
            while(sbc.read(buf) > 0) {
                buf.rewind();
                System.out.println(Charset.forName(encoding).decode(buf));
                buf.flip();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    void readFileWithUnBufferedStream() {
        Path file = Paths.get("logfile.txt");
        try (InputStream in = Files.newInputStream(file);
             BufferedReader reader = new BufferedReader(new InputStreamReader(in))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e1) {
            e1.printStackTrace();
        }

    }

    @Test
    void bufferedReader() {
        Charset charset = Charset.forName("UTF-8");
        Path file = null;
        try (BufferedReader reader = Files.newBufferedReader(file, charset)) {

            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException x) {
            System.err.format("IOException: %s%n", x);
        }
    }

    @Test
    void bufferedWriter() {
        Charset charset = Charset.forName("UTF-8");
        Path file = null;
        String s = "heheheheh";
        try (BufferedWriter writer = Files.newBufferedWriter(file, charset)) {
            writer.write(s, 0, s.length());
            writer.write(s);

        } catch (IOException x) {
            System.err.format("IOException: %s%n", x);
        }
    }
}
