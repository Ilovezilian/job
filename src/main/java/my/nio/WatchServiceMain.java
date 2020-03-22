package my.nio;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;
import java.nio.file.*;

import static java.nio.file.StandardWatchEventKinds.*;

public class WatchServiceMain {
    public static void main(String[] args) throws IOException {
        ClassPathXmlApplicationContext context =
                new ClassPathXmlApplicationContext(
                        "META-INF/spring/knight.xml");
        WatchService watcher = FileSystems.getDefault().newWatchService();
        Path dir = Paths.get(".");
        try {
            WatchKey key = dir.register(watcher,
                    ENTRY_CREATE,
                    ENTRY_DELETE,
                    ENTRY_MODIFY);
        } catch (IOException x) {
            System.err.println(x);
        }
        String type = Files.probeContentType(dir);
        String separator = FileSystems.getDefault().getSeparator();
    }

}
