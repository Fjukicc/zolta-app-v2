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

export const addService = async (service_to_add) => {
  try {
    const data = await fetch(
      "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service",
      {
        method: "PUT",
        body: JSON.stringify(service_to_add),
      }
    );

    if (!data.ok) {
      throw new Error("Nemožemo Dodati Servis");
    }

    const new_service = await data.json();

    if (new_service.result === false) {
      throw new Error(new_service.err_log);
    }

    return {
      success: true,
      data: new_service,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: error };
  }
};

export const deleteService = async (service_id) => {
  try {
    var reqBody = {
      id: service_id,
    };

    const data = await fetch(
      "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service",
      {
        method: "DELETE",
        body: JSON.stringify(reqBody),
      }
    );

    if (!data.ok) {
      throw new Error("Nemozemo obrisati servis!");
    }

    const deleted_service = data.json();

    if (deleted_service.result === false) {
      throw new Error("Nemozemo obrisati servis!");
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error };
  }
};

export const updateService = async (service_to_update) => {
  try {
    const data = await fetch(
      "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service",
      {
        method: "PATCH",
        body: JSON.stringify(service_to_update),
      }
    );

    if (!data.ok) {
      throw new Error("Nemožemo ažurirati servis");
    }

    const updated_service = await data.json();

    if (updated_service.result === false) {
      throw new Error(updateService.err_log);
    }

    return {
      success: true,
      data: updated_service,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error,
    };
  }
};
