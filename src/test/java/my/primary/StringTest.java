package my.primary;

import org.junit.Test;

public class StringTest {

    /**
     * 替换 \ 时，表达式需要要注意使用一个 \\\\ 替换 \ 。还是自己没有看仔细来的。
     */
    @Test
    public void replaceSpecialCharTest() {
        String s = "abcd".replaceAll("a", "b");
        System.out.println("s = " + s);
        String s1 = "ab\\\"cd".replaceAll("\\\\", "");
        System.out.println("s1 = " + s1);
    }

    @Test
    public void equalsTest() {
        String a = new String("test");
        System.out.println(("test").equals(a));
        System.out.println("test".equals(a));
    }

}
