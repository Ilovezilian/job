package my.interfacesInheritance.implement;

import my.interfacesInheritance.interfaces.Relatable;
import my.interfacesInheritance.interfaces.TestInterface;

/**
 * Created by Ilovezilian on 2017/7/30.
 */
public class TestInstance implements Relatable, TestInterface {
    @Override
    public int isLargeThan(Relatable other) {
        return 0;
    }

    @Override
    public void hello() {
        System.out.println("hello");
    }
}
