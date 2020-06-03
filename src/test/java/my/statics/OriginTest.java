package my.statics;

import org.testng.annotations.Test;

import static org.testng.Assert.*;

public class OriginTest {

    @Test
    public void testGetPrt() {
        Origin.getPrt();
    }

    @Test
    public void testPrt() {
        Origin.prt();
    }
}