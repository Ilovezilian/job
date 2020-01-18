package my.jaxp.stax;

import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import javax.xml.stream.events.XMLEvent;
import java.io.FileInputStream;

public class Test {
    public static void main(String[] args) {

//        try {
//            for (int i = 0; i < count; i++) {
//                // pass the file name.. all relative entity
//                // references will be resolved against this
//                // as base URI.
//                XMLStreamReader xmlr = xmlif.createXMLStreamReader(filename,
//                        new FileInputStream(filename));
//
//                // when XMLStreamReader is created,
//                // it is positioned at START_DOCUMENT event.
//                int eventType = xmlr.getEventType();
//                printEventType(eventType);
//                printStartDocument(xmlr);
//
//                // check if there are more events
//                // in the input stream
//                while (xmlr.hasNext()) {
//                    eventType = xmlr.next();
//                    printEventType(eventType);
//
//                    // these functions print the information
//                    // about the particular event by calling
//                    // the relevant function
//                    printStartElement(xmlr);
//                    printEndElement(xmlr);
//                    printText(xmlr);
//                    printPIData(xmlr);
//                    printComment(xmlr);
//                }
//            }
//        } catch (XMLStreamException e) {
//            e.printStackTrace();
//        }
    }
    public final static String getEventTypeString(int eventType) {
        switch (eventType) {
            case XMLEvent.START_ELEMENT:
                return "START_ELEMENT";

            case XMLEvent.END_ELEMENT:
                return "END_ELEMENT";

            case XMLEvent.PROCESSING_INSTRUCTION:
                return "PROCESSING_INSTRUCTION";

            case XMLEvent.CHARACTERS:
                return "CHARACTERS";

            case XMLEvent.COMMENT:
                return "COMMENT";

            case XMLEvent.START_DOCUMENT:
                return "START_DOCUMENT";

            case XMLEvent.END_DOCUMENT:
                return "END_DOCUMENT";

            case XMLEvent.ENTITY_REFERENCE:
                return "ENTITY_REFERENCE";

            case XMLEvent.ATTRIBUTE:
                return "ATTRIBUTE";

            case XMLEvent.DTD:
                return "DTD";

            case XMLEvent.CDATA:
                return "CDATA";

            case XMLEvent.SPACE:
                return "SPACE";
        }
        return "UNKNOWN_EVENT_TYPE , " + eventType;
    }
}
