package my.interfacesInheritance.implement;

import my.interfacesInheritance.interfaces.TimeClient;

/**
 * Created by Ilovezilian on 2017/7/30.
 */


public class TestSimpleTimeClient {
    public static void main(String... args) {
        TimeClient myTimeClient = new SimpleTimeClient();
        System.out.println("Current time: " + myTimeClient.toString());
        System.out.println("Time in California: " +
                myTimeClient.getZonedDateTime("Blah blah").toString());
    }
}