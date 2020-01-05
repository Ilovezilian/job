package my;

import org.junit.Test;

import java.io.PrintStream;
import java.util.Calendar;
import java.util.Formatter;
import java.util.Locale;

/**
 * Created by Ilovezilian on 2017/8/27.
 */
public class Print {
    @Test
    public void testFormat() {
        long n = 461012;
        System.out.format("%d%n", n);      //  -->  "461012"
        System.out.format("%08d%n", n);    //  -->  "00461012"
        System.out.format("%+8d%n", n);    //  -->  " +461012"
        System.out.format("%,8d%n", n);    // -->  " 461,012"
        System.out.format("%+,8d%n%n", n); //  -->  "+461,012"

        double pi = Math.PI;

        System.out.format("%f%n", pi);       // -->  "3.141593"
        System.out.format("%.3f%n", pi);     // -->  "3.142"
        System.out.format("%10.3f%n", pi);   // -->  "     3.142"
        System.out.format("%-10.3f%n", pi);  // -->  "3.142"
        System.out.format(Locale.FRANCE,
                "%-10.4f%n%n", pi); // -->  "3,1416"

        Calendar c = Calendar.getInstance();
        System.out.format("%tB %te, %tY%n", c, c, c); // -->  "May 29, 2006"

        System.out.format("%tl:%tM %tp%n", c, c, c);  // -->  "2:34 am"

        System.out.format("%tD%n", c);    // -->  "05/29/06"
    }

    @Test
    public void SystemPrint() {
        System.out.format("Local time: %tT\n", Calendar.getInstance());

        System.out.format("%4$2s %3$2s %2$2s %1$2s\n", "a", "b", "c", "d");
    }

    @Test
    public void formatter() {
        StringBuilder sb = new StringBuilder();
        Formatter formatter = new Formatter(sb, Locale.US);
        formatter.format("%4$2s %3$2s %2$2s %1$2s", "a", "b", "c", "d");

        System.out.format("%4$2s %3$2s %2$2s %1$2s\n", "a", "b", "c", "d");
        System.out.printf("%4$2s %3$2s %2$2s %1$2s\n", "a", "b", "c", "d");

        System.out.format(Locale.FRANCE, "e = %+10.4f\n", Math.E);
        ;

        PrintStream balanceDelta = null;
        System.out.format("Amount gained or lost since last statement: $ %(,.2f\n",
                balanceDelta);
    }

    @Test
    public void formatPrint() {
        float floatVar = 0.1f;
        int intVar = 11;
        String stringVar = "heihei";
        System.out.format("The value of " + "the float variable is " +
                "%f, while the value of the " + "integer variable is %d, " +
                "and the string is %s", floatVar, intVar, stringVar);
    }
}
