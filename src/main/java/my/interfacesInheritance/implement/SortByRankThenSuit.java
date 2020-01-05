package my.interfacesInheritance.implement;

import my.interfacesInheritance.interfaces.Card;

import java.util.Comparator;

/**
 * Created by Ilovezilian on 2017/7/30.
 */
public class SortByRankThenSuit implements Comparator<Card> {
    public int compare(Card firstCard, Card secondCard) {
        int compVal =
                firstCard.getRank().value() - secondCard.getRank().value();
        if (compVal != 0)
            return compVal;
        else
            return firstCard.getSuit().value() - secondCard.getSuit().value();
    }
}
