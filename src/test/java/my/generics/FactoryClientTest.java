package my.generics;

import org.junit.Test;


public class FactoryClientTest {
    @Test
    public void selectTest() {
        new FactoryClient().select(EmpInfo::new, "selection string");
    }

}