package my.interfacesInheritance.inheritance;

import org.junit.Test;

/**
 * Created by Ilovezilian on 2017/8/20.
 */
public class PersonTest {
    @Test
    public void personClassTest() {
        Object obj = new Person();
        Class c =  obj.getClass();
        System.out.println("simpleName = " + c.getSimpleName());
        System.out.println("name = " + c.getName());
    }


}