package my.statics;

import org.testng.annotations.Test;

import static org.testng.Assert.*;

public class SunTest {
    @Test
    public void testGetPrt() {
        Origin.getPrt();
    }

    @Test
    public void testPrt() {
        Sun.prt();
    }
}