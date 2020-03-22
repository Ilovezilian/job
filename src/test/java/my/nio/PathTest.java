package my.nio;

import my.constant.Constants;
import org.testng.annotations.Test;

import java.nio.file.Path;
import java.nio.file.Paths;

public class PathTest {
    @Test
    public void createPath() {
        Path path = Paths.get("ni/kai/wan/xiao");
        System.out.println("path = " + path);
    }

    @Test
    public void resolveTest() {
        Path path = Paths.get(Constants.BASE_DIRECTORY);
        final Path shuai = path.resolve("shuai");
        System.out.println("shuai = " + shuai);
    }
}
