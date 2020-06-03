package my.primary;

import org.testng.annotations.Test;

public class StringReplaceTest {
    @Test
    public void ReplaceAllTest() {
        String str = "[a,b,c,d]";
        String all = str.replaceAll("]", "").replaceAll("\\[", "").replaceAll(",", "','");
        System.out.println("all = " + all);
    }
}
