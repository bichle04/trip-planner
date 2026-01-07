import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg text-xl font-bold",
          description: "group-[.toast]:text-muted-foreground text-lg font-semibold",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-semibold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-semibold",
          error: "group-[.toaster]:bg-red-100 group-[.toaster]:text-red-800 group-[.toaster]:border-2 group-[.toaster]:border-red-500 text-xl font-bold",
          success: "group-[.toaster]:bg-green-100 group-[.toaster]:text-green-800 group-[.toaster]:border-2 group-[.toaster]:border-green-500 text-xl font-bold",
          warning: "group-[.toaster]:bg-yellow-100 group-[.toaster]:text-yellow-800 group-[.toaster]:border-2 group-[.toaster]:border-yellow-500 text-xl font-bold",
          info: "group-[.toaster]:bg-blue-100 group-[.toaster]:text-blue-800 group-[.toaster]:border-2 group-[.toaster]:border-blue-500 text-xl font-bold",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
