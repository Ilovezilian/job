package my.numbersAndStrings;

import org.junit.Test;

/**
 * Created by Ilovezilian on 2017/8/27.
 */
public class StringDemoTest {
    @Test
    public void testString() {
        String s = "heihei";
        justChange(s);
        System.out.println(s);
    }

    private void justChange(String s) {
        s = "shuai";
    }

    @Test
    public void anotherPrintlnManner() {
        float floatVar = 0.1f;
        int intVar = 1;
        String stringVar = "heihei";

        // principle writing manner
        System.out.printf("The value of the float " +
                        "variable is %f, while " +
                        "the value of the " +
                        "integer variable is %d, " +
                        "and the string is %s\n\n",
                floatVar, intVar, stringVar);

        // a simple and beautiful writing manner
        String fs;
        fs = String.format("The value of the float " +
                        "variable is %f, while " +
                        "the value of the " +
                        "integer variable is %d, " +
                        " and the string is %s\n\n",
                floatVar, intVar, stringVar);
        System.out.println(fs);
        String aStr = null;
        String a = String.format("a new String(nullStringVar) = %s\n\n", String.valueOf(aStr));

        System.out.println(a);
    }

}