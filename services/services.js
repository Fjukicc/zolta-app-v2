// fetch services for company
export const fetchServices = async (company_id) => {
  try {
    const data = await fetch(
      "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service/filter",
      {
        method: "POST",
        body: JSON.stringify({
          company_id: company_id,
        }),
      }
    );
    if (!data.ok) {
      throw new Error("Failed to fetch company employess");
    }
    const list_of_services = await data.json();
    return {
      success: true,
      data: list_of_services,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch company employess",
    };
  }
};
