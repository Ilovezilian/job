package my.interfacesInheritance.implement;

import my.interfacesInheritance.interfaces.Card;
import org.junit.Test;

import java.util.Comparator;

/**
 * Created by Ilovezilian on 2017/7/30.
 */
public class StandardDeckTest {
    @Test
    public void testSort4() {
        StandardDeck myDeck = new StandardDeck();
        myDeck.shuffle();
        myDeck.sort(Comparator.comparing(Card::getRank));
        myDeck.sort(
                Comparator.comparing(Card::getRank)
                        .reversed()
                        .thenComparing(Comparator.comparing(Card::getSuit)));
    }

    @Test
    public void testSort3() {
        StandardDeck myDeck = new StandardDeck();
        myDeck.shuffle();
        myDeck.sort(
                Comparator.comparingInt(firstCard -> firstCard.getRank().value())
        );

        myDeck.sort(
                Comparator.comparing(firstCard -> firstCard.getRank().value())
        );
    }

    @Test
    public void testSort2() {
        StandardDeck myDeck = new StandardDeck();
        myDeck.shuffle();
        myDeck.sort(
                (firstCard, secondCard) ->
                        firstCard.getRank().value() - secondCard.getRank().value()
        );
    }

    @Test
    public void testSort1() {
        StandardDeck myDeck = new StandardDeck();
        myDeck.shuffle();
        myDeck.sort(new SortByRankThenSuit());
    }

}