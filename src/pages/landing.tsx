import { motion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <Code2 className="h-16 w-16 text-purple-400" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Python Automation Made Simple
            </h1>
            <p className="text-xl text-purple-200/60 mb-8">
              Create, share, and discover Python automation scripts with our intuitive block editor.
              No coding experience required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/new">
              <Button size="lg" className="space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Start Creating</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" size="lg">
                Explore Community
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            <div className="p-6 rounded-xl border border-purple-200/20 bg-white/5">
              <Zap className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
              <p className="text-purple-200/60">
                Drag and drop blocks to create powerful Python scripts without writing code.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-purple-200/20 bg-white/5">
              <Sparkles className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Share & Discover</h3>
              <p className="text-purple-200/60">
                Join a community of automation enthusiasts and share your creations.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-purple-200/20 bg-white/5">
              <Code2 className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real Python</h3>
              <p className="text-purple-200/60">
                Generate clean, efficient Python code that you can run anywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}