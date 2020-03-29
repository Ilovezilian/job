package my.generics;

import org.junit.Test;

import java.util.ArrayList;
import java.util.Collection;

public class InteroperatingWithLegacyCode {
    @Test
    public void UsingLegacyCodeInGenericCodeTest() {
        Collection<Part> c = new ArrayList<Part>();
        c.add(new Guillotine()) ;
        c.add(new Blade());
        Inventory.addAssembly("thingee", c);
        Collection<Part> k = Inventory.getAssembly("thingee").getParts();
    }

    @Test
    public void UsingGenericCodeInLegacyCodeTest() {
        Collection c = new ArrayList();
        c.add(new Guillotine()) ;
        c.add(new Blade());

        // 1: unchecked warning
        Inventory.addAssembly("thingee", c);

        Collection k = Inventory.getAssembly("thingee").getParts();
    }
}
