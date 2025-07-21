import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  company:{
    type:String,
    required:true
  },
  location: String,
  type: String,
  description: String,
  salary: String,
  deadline: Date,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requirements:[String]

}, {
  timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
