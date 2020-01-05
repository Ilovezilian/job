package my.generics;

import org.junit.Test;

/**
 * Created by Ilovezilian on 2017/10/29.
 */
public class MyNodeTest {

    @Test
    public void testCode() {
        MyNode mn = new MyNode(5);
        Node n = mn;            // A raw type - compiler throws an unchecked warning
        n.setData("Hello");
        Integer x = mn.data;    // Causes a ClassCastException to be thrown.


    }

    @Test
    public void testCodeAfterCompile() {
        MyNode mn = new MyNode(5);
        Node n = (MyNode)mn;         // A raw type - compiler throws an unchecked warning
        n.setData("Hello");
//        Integer x = (String)mn.data; // Causes a ClassCastException to be thrown.
    }

}