package my.interfacesInheritance.interfaces;

/**
 * Created by Ilovezilian on 2017/7/30.
 */
public interface TestInterface {
    void hello();
    default void hello(String name){
        System.out.println("hello " + name);
    }
}
