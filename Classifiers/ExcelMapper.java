package data;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExcelMapper {

	private static final String SOURCE = "/Users/pramod/Documents/GoogleDrive/RA/AI/census_data.csv";
	private static final String DESTINATION = "/Users/pramod/Documents/GoogleDrive/RA/AI/unique_inventor.csv";
	private static final String OUTPUT = "/Users/pramod/Documents/GoogleDrive/RA/AI/output.csv";
	private static final String NOOUTPUT = "/Users/pramod/Documents/GoogleDrive/RA/AI/nooutput.csv";

	private static final Map<String, String> nameMap = new HashMap<String, String>();
	private static final Map<String, String> resultMap = new HashMap<String, String>();

	public static void main(String[] args) throws IOException {

		BufferedWriter bw = new BufferedWriter(new FileWriter(OUTPUT));
		BufferedWriter nbw = new BufferedWriter(new FileWriter(NOOUTPUT));

		try (BufferedReader br = new BufferedReader(new FileReader(SOURCE))) {
			String line = null;
			while ((line = br.readLine()) != null) {
				String data[] = line.split(",");
				String name = data[0].toLowerCase();
				String val = line.substring(name.length() + 1);
				nameMap.put(name, val);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		List<String> list = new ArrayList<String>();
		bw.write(
				"inventor_first_name,inventor_last_name,inventor_country,inventor_id,rank,count,prop100k,cum_prop100k,pctwhite,pctblack,pctapi,pctaian,pct2prace,pcthispanic \n");

		try (BufferedReader br = new BufferedReader(new FileReader(DESTINATION))) {
			String line = null;
			while ((line = br.readLine()) != null) {
				String data[] = line.trim().split(",");
				String name = data[1].toLowerCase();
				String result = nameMap.get(name);
				if (result == null) {
					nbw.write(line + "," + result + "\n");
				} else {
					bw.write(line + "," + result + "\n");
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		bw.close();
		nbw.close();
		System.out.println("Donere : " + nameMap.size() + " " + resultMap.size() + " ::" + list.size());

	}

}
