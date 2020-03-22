package my.nio;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.SeekableByteChannel;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.HashSet;
import java.util.Set;

import static java.nio.file.StandardOpenOption.*;

public class LogFilePermissionsTest {

    public void test() {
        String s = "I was here!\n";
        byte[] data = s.getBytes();
        ByteBuffer out = ByteBuffer.wrap(data);
        Path file = Paths.get("./permissions.log");

        ByteBuffer copy = ByteBuffer.allocate(12);

        try (FileChannel fc = (FileChannel.open(file, READ, WRITE))) {
            // Read the first 12
            // bytes of the file.
            int nread;
            do {
                nread = fc.read(copy);
            } while (nread != -1 && copy.hasRemaining());

            // Write "I was here!" at the beginning of the file.
            fc.position(0);
            while (out.hasRemaining()) {
                fc.write(out);
            }
            out.rewind();

            // Move to the end of the file.  Copy the first 12 bytes to
            // the end of the file.  Then write "I was here!" again.
            long length = fc.size();
            fc.position(length - 1);
            copy.flip();
            while (copy.hasRemaining()) {
                fc.write(copy);
            }
            while (out.hasRemaining()) {
                fc.write(out);
            }
        } catch (IOException x) {
            System.out.println("I/O Exception: " + x);
        }
    }

    public static void main(String[] args) {

        // Create the set of options for appending to the file.
        Set<OpenOption> options = new HashSet<OpenOption>();
        options.add(APPEND);
        options.add(CREATE);

        // Create the custom permissions attribute.
        Set<PosixFilePermission> perms =
                PosixFilePermissions.fromString("rw-r-----");
        FileAttribute<Set<PosixFilePermission>> attr =
                PosixFilePermissions.asFileAttribute(perms);

        // Convert the string to a ByteBuffer.
        String s = "Hello World! ";
        byte data[] = s.getBytes();
        ByteBuffer bb = ByteBuffer.wrap(data);

        Path file = Paths.get("./permissions.log");

        try (SeekableByteChannel sbc =
                     Files.newByteChannel(file, options, attr)) {
            sbc.write(bb);
        } catch (IOException x) {
            System.out.println("Exception thrown: " + x);
        }
    }
}