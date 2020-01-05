package my.base;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

/**
 * Created by Ilovezilian on 2017/7/9.
 */
public class MethodReferences {

    public static void main(String[] args) {
        List<Person> roster = new ArrayList<>();
        Person person = new Person();
        Runnable getBirthday = person::getBirthday;
        LocalDate date = person.getBirthday();
        Person[] rosterAsArray = roster.toArray(new Person[roster.size()]);

        //Reference to an Instance Method of an Arbitrary Object of a Particular Type
        String[] stringArray = { "Barbara", "James", "Mary", "John",
                "Patricia", "Robert", "Michael", "Linda" };
        Arrays.sort(stringArray, String::compareToIgnoreCase);


        //sort by lambda expression
        Arrays.sort(rosterAsArray, (Person a, Person b) -> {
                    return a.getBirthday().compareTo(b.getBirthday());
                }
        );

        Arrays.sort(rosterAsArray, (a, b) -> {
                    return a.getBirthday().compareTo(b.getBirthday());
                }
        );

        Arrays.sort(rosterAsArray, Comparator.comparing(Person::getBirthday));

        Arrays.sort(rosterAsArray, Person::compareByAge);

        //sort
        class PersonAgeComparator implements Comparator<Person> {
            public int compare(Person a, Person b) {
                return a.getBirthday().compareTo(b.getBirthday());
            }
        }

        Arrays.sort(rosterAsArray, new PersonAgeComparator());


    }
}
