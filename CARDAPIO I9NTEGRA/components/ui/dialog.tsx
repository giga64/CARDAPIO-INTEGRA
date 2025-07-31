import React from 'react';

// Função utilitária para combinar classes CSS
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// Interfaces TypeScript
interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

interface DialogCloseProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  onClick?: () => void;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

// Componente Dialog baseado no Radix UI
const Dialog: React.FC<DialogProps> = ({ children, open, onOpenChange }) => {
  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      {children}
    </div>
  );
};

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  );
};

const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const DialogClose: React.FC<DialogCloseProps> = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className={cn("cursor-pointer", className)}>
      {children}
    </button>
  );
};

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, onClick, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
        "animate-in fade-in-0 duration-200",
        className
      )}
      onClick={onClick}
      {...props}
    />
  )
);
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]",
          "rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </DialogClose>
      </div>
    </DialogPortal>
  )
);
DialogContent.displayName = "DialogContent";

const DialogHeader: React.FC<DialogHeaderProps> = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter: React.FC<DialogFooterProps> = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}; 