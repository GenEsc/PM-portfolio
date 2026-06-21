import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "@/components/sections/ContactForm";

describe("ContactForm", () => {
  it("renders the name, email and message fields plus submit button", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Descripción del proyecto")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enviar mensaje" })
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty", () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(screen.getByText("Indica tu nombre.")).toBeInTheDocument();
    expect(screen.getByText("Indica tu email.")).toBeInTheDocument();
    expect(
      screen.getByText("Cuéntame brevemente tu proyecto.")
    ).toBeInTheDocument();
  });

  it("validates the email format", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByLabelText("Descripción del proyecto"), {
      target: { value: "Hola" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(screen.getByText("El email no es válido.")).toBeInTheDocument();
  });

  it("submits valid data to the contact endpoint", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true } as Response);
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ana@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Descripción del proyecto"), {
      target: { value: "Necesito una tienda online." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({ method: "POST" })
      )
    );
  });

  it("uses the light-on-emerald palette when onAccent is set", () => {
    render(<ContactForm onAccent />);
    // Same fields and validation, but styled for the green contact block.
    expect(screen.getByLabelText("Nombre")).toHaveClass("text-white");
    const button = screen.getByRole("button", { name: "Enviar mensaje" });
    expect(button).toHaveClass("bg-white");
  });
});
