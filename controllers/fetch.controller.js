import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Function to fetch data from Supabase
export const getPackageDataFromDB = async (req, res) => {
  try {
    // Fetch data from the 'packages' table
    const { data, error } = await supabase
      .from('packages') // Replace with your Supabase table name
      .select('*'); // Modify the select query if needed

    if (error) {
      throw error;
    }

    // Send the data as JSON
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to fetch country data from Supabase
export const getCountryDataFromDB = async (req, res) => {
  try {
    // Fetch data from the 'countries' table
    const { data, error } = await supabase
      .from('countries') // Replace with your Supabase table name
      .select('*'); // Modify the select query if needed

    if (error) {
      throw error;
    }

    // Send the data as JSON
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching country data from Supabase:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to fetch collections data from Supabase
export const getCollectionDataFromDB = async (req, res) => {
  try {
    // Fetch data from the 'collections' table
    const { data, error } = await supabase
      .from('collections') // Replace with your Supabase table name
      .select('*'); // Modify the select query if needed

    if (error) {
      throw error;
    }

    // Send the data as JSON
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching collections data from Supabase:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
