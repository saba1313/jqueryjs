package com.jquery.web;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import junit.framework.TestCase;

import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class RequestTest extends TestCase {
	
	public class Person {

		private int age;

		private String firstname;
		
		private List<String> middleNames;

		public String[] getMiddleNames() {
			return middleNames.toArray(new String[0]);
		}

		public void setMiddleNames(String[] middleNames) {
			this.middleNames = Arrays.asList(middleNames);
		}

		public int getAge() {
			return age;
		}

		public void setAge(int age) {
			this.age = age;
		}

		public String getFirstname() {
			return firstname;
		}

		public void setFirstname(String firstname) {
			this.firstname = firstname;
		}

	}
	
	@Override
	protected void setUp() throws Exception {
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.setParameter("age", "16");
		request.setParameter("firstname", "Peter");
		request.setParameter("middleNames", middleNames);
		this.request = request;
		RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
	}
	
	HttpServletRequest request;
	
	String[] middleNames = { "A.", "J.", "P." };

	public void testServletRequestToBean() {
		Person person = new Person();
		new Request(request).mapTo(person);
		assertPerson(person);
	}
	
	public void testRequestContextHolderToBean() {
		Person person = new Person();
		new Request().mapTo(person);
		assertPerson(person);
	}

	private void assertPerson(Person person) {
		assertEquals(16, person.getAge());
		assertEquals("Peter", person.getFirstname());
		assertEquals(middleNames.length, person.getMiddleNames().length);
	}

}
