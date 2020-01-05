package excption;


import org.junit.Test;

public class ExceptionTest {

    @Test
    public void tryCatchTest() {
        System.out.println(tryCatchReturn());
    }

    private int tryCatchReturn() {
        try {
            return 1;
        } finally {
            return 2;
        }
    }
}
