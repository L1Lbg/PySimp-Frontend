import { Mail } from 'lucide-react';

export default function Footer() {
  return (
      <footer className="border-t border-purple-200/10 bg-black/50 backdrop-blur-lg mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-purple-200/60">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:helpautonomia@proton.me"
                className="hover:text-purple-200"
              >
                helpautonomia@proton.me
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200/60">
              <a
                target="_blank"
                href="/legal/tos"
                className="hover:text-purple-200"
              >
                Terms of Service
              </a>
              <a
                target="_blank"
                href="/legal/privacy-policy"
                className="hover:text-purple-200"
              >
                Privacy Policy
              </a>
              <a
                target="_blank"
                href="/legal/disclaimers"
                className="hover:text-purple-200"
              >
                Disclaimers
              </a>
              <a
                target="_blank"
                href="/legal/cookie-policy"
                className="hover:text-purple-200"
              >
                Cookie Policy
              </a>
              <a
                target="_blank"
                href="/legal/refund-policy"
                className="hover:text-purple-200"
              >
                Refund Policy
              </a>
              <a
                target="_blank"
                href="/legal/referral-program"
                className="hover:text-purple-200"
              >
                Referral Program
              </a>
            </div>
          </div>
        </div>
      </footer>
  );
}
