package my.jaxp.limits;/*
 * Copyright (c) 2013, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

import java.io.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.SAXParser;
import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import org.w3c.dom.Document;
import org.xml.sax.helpers.DefaultHandler;

/**
 * JAXP Limit, samples
 * 
 */
public class LimitSamples extends SampleBase {

    public LimitSamples(String name) {
        super(name);
    }
    
    String xmlSample_Templates, xmlSample_html, xmlSample_Mathml;
    
    protected void setUp() {
        super.setUp();
        xmlSample_Templates = filePath + "/samples/Templates.xml";    
        xmlSample_html = filePath + "/samples/html.xml";    
        xmlSample_Mathml = filePath + "/samples/mathml3.xml";    
        if (isWindows) {
            xmlSample_Templates = "/" + xmlSample_Templates;
            xmlSample_html = "/" + xmlSample_html;
            xmlSample_Mathml = "/" + xmlSample_Mathml;
        }    
    }
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws Exception {
        LimitSamples sample = new LimitSamples("Samples");
        if (sample.isNewPropertySupported()) {
            sample.setUp();
            sample.parseHTMLDTD();
            sample.parseMathML();
            sample.parseTemplates();
            sample.parseWithDOM();
            sample.parseWithStAXNotSupportDTD();
            sample.tearDown();
        }

    }
    
    /**
     * parse HTML DTD to understand the need for the limits
     */
    public void parseHTMLDTD() {
        System.out.println("Sample: parsing HTML DTD\n\n");
        try {
            SAXParser parser = getSAXParser();
            parser.setProperty(JDK_ENTITY_COUNT_INFO, "yes");
            parser.parse(new File(xmlSample_html), new DefaultHandler());
        } catch (Exception e) {
            unexpectedException("parseHTMLDTD", e, "entityExpansion");
        }
    }
    /**
     * parse MathML DTD to understand the need for the limits
     */
    public void parseMathML() {
        System.out.println("\n\nSample: parsing W3C MathML\n\n");

        try {
            SAXParser parser = getSAXParser();
            parser.setProperty(JDK_MAX_ELEMENT_DEPTH, "100");
            parser.setProperty(JDK_ENTITY_COUNT_INFO, "yes");
            parser.parse(new File(xmlSample_Mathml), new DefaultHandler());
        } catch (Exception e) {
            unexpectedException("parseMathML", e, "entityExpansion");
        }
    }
    
    /**
     * parse some samples to understand the need for the limits
     */
    public void parseTemplates() {
        System.out.println("\n\nSample: parsing templates\n\n");

        try {
            SAXParser parser = getSAXParser();
            parser.setProperty(JDK_ENTITY_COUNT_INFO, "yes");
            
            parser.parse(new File(xmlSample_Templates), new DefaultHandler());
        } catch (Exception e) {
            unexpectedException("parseTemplates", e, "entityExpansion");
        }
    }    

    /**
     * Set limits through the JAXP API
     */
    public void parseWithDOM() {
        System.out.println("\n\nSample: set limits through DocumentBuilderFactory\n\n");
        
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            dbf.setAttribute(JDK_ENTITY_EXPANSION_LIMIT, "2000");
            dbf.setAttribute(JDK_TOTAL_ENTITY_SIZE_LIMIT, "100000");
            dbf.setAttribute(JDK_PARAMETER_ENTITY_SIZE_LIMIT, "20000");
            dbf.setAttribute(JDK_ENTITY_COUNT_INFO, "yes");
            DocumentBuilder docBuilder = dbf.newDocumentBuilder();;
            Document document = docBuilder.parse(new File(xmlSample_Mathml));
        } catch (Exception e) {
            unexpectedException("parseWithDOM", e, "Setting limits");
        }
    }  
    
    /**
     * Set limits through system properties
     */
    public void parseWithDOMSP() {
        System.out.println("\n\nSample: set limits through system properties\n\n");
        System.setProperty(SP_ENTITY_EXPANSION_LIMIT, "2000");
        System.setProperty(SP_TOTAL_ENTITY_SIZE_LIMIT, "100000");
        System.setProperty(SP_PARAMETER_ENTITY_SIZE_LIMIT, "20000");
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = dbf.newDocumentBuilder();;
            Document document = docBuilder.parse(new File(xmlSample_Mathml));
        } catch (Exception e) {
            unexpectedException("parseWithDOMSP", e, "Setting limits");
        } finally {
            System.clearProperty(SP_GENERAL_ENTITY_SIZE_LIMIT);
            System.clearProperty(SP_TOTAL_ENTITY_SIZE_LIMIT);
            System.clearProperty(SP_PARAMETER_ENTITY_SIZE_LIMIT); 
        }
    }  

    /**
     * When SupportDTD=false, entity reference will result in an error
     * regardless of the settings of the new limits
     */
    public void parseWithStAXNotSupportDTD() {
        System.out.println("\n\nSample: StAX, supportDTD=false\n\n");
        XMLInputFactory xif = null;
        try {
            xif = XMLInputFactory.newInstance();
            xif.setProperty(XMLInputFactory.SUPPORT_DTD, Boolean.FALSE);
            xif.setProperty(JDK_ENTITY_EXPANSION_LIMIT, "1000");
            XMLEventReader er = xif.createXMLEventReader(xmlSample_Mathml, new FileInputStream(xmlSample_Mathml));            
            readEvent(er);
        } catch (Exception e) {
            expectedException("StAX compatibility test", e, 
                    "existing properties, such as SupportDTD, take preference over the new limits; ");
        }
    }
}
