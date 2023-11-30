// fetchEmplyees for company
export const fetchEmployess = async (company_id) => {
  try {
    const data = await fetch("http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/admin/filter", {
      method: "POST",
      body: JSON.stringify({
        company_id: company_id,
      }),
    });
    if (!data.ok) {
      throw new Error("Failed to fetch company employess");
    }
    const list_of_employees = await data.json();
    return {
      success: true,
      data: list_of_employees,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch company employess",
    };
  }
};
